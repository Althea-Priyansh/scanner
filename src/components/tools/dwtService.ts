import type { WebTwain } from "dwt/dist/types/WebTwain";
import type {
  DeviceConfiguration,
  ScanSetup,
} from "dwt/dist/types/WebTwain.Acquire";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { browserInfo } from "./common";
import Dynamsoft from "dwt";

export class DwtService {
  public bufferSubject: Subject<string> = new Subject<string>();
  public generalSubject: Subject<any> = new Subject<any>();

  // WebTwain Instance
  public _dwtObject?: WebTwain;

  protected _devices: Device[] = [];
  protected _selectedDevice: string = "";

  protected _fileSavingPath = "";
  protected _fileActualName = "";
  protected _beforeSaveIndex: number = -1;

  protected _containerId: string;

  constructor(containerId: string) {
    this._containerId = containerId;
  }

  init(
    _serviceInitReadyCallback: Function,
    _serviceInitErrorCallback: Function
  ) {
    // ResourcesPath & ProductKey must be set in order to use the library!
    Dynamsoft.DWT.ResourcesPath = environment.Dynamsoft.resourcesPath;
    Dynamsoft.DWT.ProductKey = environment.Dynamsoft.dwtProductKey;
    Dynamsoft.DWT.ServiceInstallerLocation =
      environment.Dynamsoft.serviceInstallerLocation;

    // , Width: 660, Height: 676
    Dynamsoft.DWT.CreateDWTObjectEx(
      { WebTwainId: this._containerId },

      (dwtInstance) => {
        this._dwtObject = dwtInstance;

        // The event OnBufferChanged is used here for monitoring the image buffer.
        dwtInstance.RegisterEvent(
          "OnBufferChanged",
          (changedIndexArray, operationType, changedIndex, imagesCount) => {
            this.bufferSubject.next("changed");
            if (this._dwtObject?.HowManyImagesInBuffer === 0)
              this.bufferSubject.next("empty");
            else this.bufferSubject.next("filled");
          }
        );

        if (_serviceInitReadyCallback) {
          _serviceInitReadyCallback(dwtInstance);
        }
      },
      (err) => {
        if (_serviceInitErrorCallback) {
          _serviceInitErrorCallback(err);
        }
      }
    );
  }

  /**
   * destroy
   */
  destroy() {
    if (this._dwtObject) {
      this._dwtObject?.dispose();
    }
  }

  /**
   * Retrieve all devices
   */
  getDevices(): Promise<Device[]> {
    return new Promise((res, rej) => {
      this._devices = [];
      this._dwtObject
        ?.GetDevicesAsync()
        .then((devicesList) => {
          for (let i = 0; i < devicesList.length; i++) {
            this._devices.push({
              deviceId: Math.floor(Math.random() * 100000).toString(),
              name: devicesList[i].displayName,
              label: devicesList[i].displayName,
              deviceInfo: devicesList[i],
            });
          }
          res(this._devices);
        })
        .catch(function (exp) {
          rej(exp.message);
        });
    });
  }

  async getScannedImages(): Promise<Blob[]> {
    return new Promise((resolve, reject) => {
      if (!this._dwtObject) {
        reject(new Error("WebTwain object is not initialized"));
        return;
      }

      const imageCount = this._dwtObject.HowManyImagesInBuffer;
      if (imageCount === 0) {
        resolve([]);
        return;
      }

      const indices = Array.from({ length: imageCount }, (_, i) => i);

      this.getBlob(indices, Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG)
        .then((blobs: Blob[]) => {
          resolve(blobs);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Retrieve device names.
   */
  getDeviceDetails() {
    return this._dwtObject?.GetSourceNames(true);
  }

  /**
   * Select a device by name.
   * @param name the name of the device
   * @returns
   */
  selectADevice(name: string): Promise<boolean> {
    return new Promise((res, rej) => {
      let waitForAnotherPromise = false;
      if (this._devices.length === 0) rej(false);

      // already selected current name
      if (this._selectedDevice != "" && this._selectedDevice == name) {
        res(true);
        return;
      }

      this._devices.forEach((value, index) => {
        if (value && value.name === name) {
          let _scannersCount = this._devices.length;

          if (index > _scannersCount - 1) {
            waitForAnotherPromise = true;
          } else {
            waitForAnotherPromise = true;
            this._dwtObject
              ?.SelectDeviceAsync(value.deviceInfo)
              .then(() => {
                this._selectedDevice = name;
                this.generalSubject.next({
                  type: "deviceName",
                  deviceName: this._selectedDevice,
                });
                res(true);
              })
              .catch((exp) => {
                rej(exp.message);
              });
          }
        }
      });
      if (!waitForAnotherPromise) {
        if (this._selectedDevice !== "") {
          this.generalSubject.next({
            type: "deviceName",
            deviceName: this._selectedDevice,
          });
          res(true);
        } else res(false);
      }
    });
  }

  /**
   * Acquire images (scanner or camera).
   * @param config Configuration for image aquisition.
   * @param bAdvanced - true: scan image by startScan API, false (default): scan image by AcuqireImageAsync API
   */
  acquire(
    config?: DeviceConfiguration | ScanSetup,
    bAdvanced?: boolean
  ): Promise<any> {
    return new Promise((res, rej) => {
      if (this._selectedDevice !== "") {
        {
          this._dwtObject?.SetOpenSourceTimeout(3000);
          if (bAdvanced) {
            if (this._dwtObject?.OpenSource()) {
              this._dwtObject?.startScan(<ScanSetup>config);
            } else {
              rej(this._dwtObject?.ErrorString);
            }
          } else {
            this._dwtObject
              ?.AcquireImageAsync(<DeviceConfiguration>config)
              .then(() => {
                return this._dwtObject?.CloseSourceAsync();
              })
              .then(() => {
                this._dwtObject?.CloseWorkingProcess();
                res(true);
              })
              .catch((exp) => {
                rej(exp.message);
              });
          }
        }
      } else {
        rej("Please select a device first!");
      }
    });
  }

  /**
   * Load images by opending a file dialog (either with built-in feature or use a INPUT element).
   */
  load(): Promise<any> {
    return new Promise((res, rej) => {
      if (!this._dwtObject) {
        return rej({
          code: -1,
          message: "invalid operation",
        });
      }

      this._dwtObject?.Addon.PDF.SetReaderOptions({
        convertMode: Dynamsoft.DWT.EnumDWT_ConvertMode.CM_AUTO,
        renderOptions: {
          resolution: 200,
        },
      });
      this._dwtObject.IfShowFileDialog = true;
      this._dwtObject.RegisterEvent(
        "OnPostLoad",
        (directory: string, fileName: string, fileType: number) => {}
      );
      this._dwtObject?.LoadImageEx(
        "",
        Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL,
        () => {
          res(true);
        },
        (errCode, errStr) =>
          rej({
            code: errCode,
            message: errStr,
          })
      );
    });
  }

  /**
   * Convert image(s) to a Blob.
   * @param indices Specify the image(s).
   * @param type Specify the type of the Blob.
   * @param dwt Specify the WebTwain instance doing the job.
   */
  getBlob(indices: number[], type: number, dwt?: WebTwain): Promise<any> {
    return new Promise((res, rej) => {
      let _dwt = this._dwtObject;
      if (dwt) _dwt = dwt;
      switch (type) {
        case Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL:
          rej("Must specify an image type!");
          break;
      }

      if (!_dwt) {
        rej("invalid operation");
        return;
      }

      _dwt.ConvertToBlob(
        indices,
        type,
        (result, indices, type) => {
          res(result);
        },
        (errCode, errString) => {
          rej(errString);
        }
      );
    });
  }

  /**
   * Convert image(s) to a Base64 string.
   * @param indices Specify the image(s).
   * @param type Specify the type of the Base64 string.
   * @param dwt Specify the WebTwain instance doing the job.
   */
  getBase64(indices: number[], type: number, dwt?: WebTwain): Promise<any> {
    return new Promise((res, rej) => {
      let _dwt = this._dwtObject;
      if (dwt) _dwt = dwt;
      if (type === Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL)
        rej("Must specify an image type!");

      if (!_dwt) {
        rej("invalid operation");
        return;
      }

      _dwt.ConvertToBase64(
        indices,
        type,
        (result, indices, type) => {
          let _result = result.getData(0, result.getLength());
          switch (type) {
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_BMP:
              res("data:image/bmp;base64," + _result);
              break;
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG:
              res("data:image/jpeg;base64," + _result);
              break;
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_TIF:
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_TIF:
              res("data:image/tiff;base64," + _result);
              break;
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG:
              res("data:image/png;base64," + _result);
              break;
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF:
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_PDF:
              res("data:application/pdf;base64," + _result);
              break;
            default:
              rej("Wrong image type!");
              break;
          }
        },
        (errCode, errString) => {
          rej(errString);
        }
      );
    });
  }

  /**
   * Return the extention string of the specified image type.
   * @param type The image type (number).
   */
  getExtension(type: number) {
    switch (type) {
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_BMP:
        return ".bmp";
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG:
        return ".jpg";
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG:
        return ".png";
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF:
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_PDF:
        return ".pdf";
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_TIF:
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_TIF:
        return ".tif";
      default:
        return ".unknown";
    }
  }

  /**
   * Saved the specified images locally.
   * @param indices Specify the image(s).
   * @param type Specify the type of the target file.
   * @param fileName Specify the file name.
   * @param showDialog Specify whether to show a saving dialog.
   */
  saveLocally(
    indices: number[],
    type: number,
    fileNameWithoutExt: string,
    showDialog: boolean
  ): Promise<any> {
    return new Promise((res, rej) => {
      if (!this._dwtObject) {
        rej("invalid operation");
        return;
      }

      this._beforeSaveIndex = this._dwtObject.CurrentImageIndexInBuffer;
      let saveInner = (_path: any, _name: any, _type: any): Promise<any> => {
        return new Promise((resInner, rejInner) => {
          let s = () => {
              if (showDialog) {
                _name = this._fileActualName;
                _path = this._fileSavingPath + "/" + _name;
              }

              if (
                type == Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_PDF ||
                type == Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_TIF
              ) {
                this._dwtObject?.SelectImages([this._beforeSaveIndex]);
              }

              resInner({ name: _name, path: _path });
            },
            f = (errCode: any, errStr: any) => {
              if (
                type == Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_PDF ||
                type == Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_TIF
              ) {
                this._dwtObject?.SelectImages([this._beforeSaveIndex]);
              }
              rejInner({
                code: errCode,
                message: errStr,
              });
            };

          switch (_type) {
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_BMP:
              this._dwtObject?.SaveAsBMP(_path, indices[0], s, f);
              break;
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG:
              this._dwtObject?.SaveAsJPEG(_path, indices[0], s, f);
              break;
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_TIF:
              this._dwtObject?.SaveAsTIFF(_path, indices[0], s, f);
              break;
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG:
              this._dwtObject?.SaveAsPNG(_path, indices[0], s, f);
              break;
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF:
              this._dwtObject?.SaveAsPDF(_path, indices[0], s, f);
              break;
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_PDF:
              this._dwtObject?.SelectImages(indices);
              this._dwtObject?.SaveSelectedImagesAsMultiPagePDF(_path, s, f);
              break;
            case Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_TIF:
              this._dwtObject?.SelectImages(indices);
              this._dwtObject?.SaveSelectedImagesAsMultiPageTIFF(_path, s, f);
              break;
            default:
              break;
          }
        });
      };

      let fileName = fileNameWithoutExt + this.getExtension(type);
      let filePath = this._fileSavingPath + "/" + fileName;
      if (showDialog) {
        this._fileSavingPath = "";
        this._fileActualName = "";
        this._dwtObject.IfShowFileDialog = false;
        Dynamsoft.Lib.showMask();
        this._dwtObject.RegisterEvent(
          "OnGetFilePath",
          (isSave, filesCount, index, directory, _fn) => {
            Dynamsoft.Lib.hideMask();
            if (directory === "" && _fn === "") {
              rej("User cancelled the operation.");
              return;
            }

            if (isSave && filesCount != -1) {
              this._fileActualName = _fn;
              this._fileSavingPath = directory;
              res(
                saveInner(
                  this._fileSavingPath + "/" + this._fileActualName,
                  this._fileActualName,
                  type
                )
              );
            }
          }
        );
        this._dwtObject?.ShowFileDialog(
          true,
          getDialogFilter(type),
          0,
          "",
          fileName,
          true,
          false,
          0
        );
      } else {
        this._dwtObject.IfShowFileDialog = false;
        res(saveInner(filePath, fileName, type));
      }
    });
  }

  /**
   * Upload the specified images to the server.
   * @param indices Specify the image(s).
   * @param type Specify the type of the target file.
   * @param fileName Specify the file name.
   */
  uploadToServer(
    indices: number[],
    type: number,
    fileName: string,
    customInfo: string
  ): Promise<any> {
    return new Promise((res, rej) => {
      const replaceLtStr = "<",
        replaceGtStr = ">";
      let tmp = fileName.replace(new RegExp(replaceLtStr, "gm"), "&lt;");
      tmp = tmp.replace(new RegExp(replaceGtStr, "gm"), "&gt;");

      let _fileName = tmp + this.getExtension(type);
      let url = environment.Dynamsoft.uploadTargetURL;

      this._dwtObject?.SetHTTPFormField("CustomInfo", customInfo);
      this._dwtObject?.HTTPUpload(
        url,
        indices,
        type,
        Dynamsoft.DWT.EnumDWT_UploadDataFormat.Binary,
        _fileName,
        () => {
          res({ name: _fileName });
        },
        (errCode, errString, responseStr) => {
          if (errCode == 0 || errCode == -2003) {
            if (errCode == -2003 && responseStr == "") {
              rej({
                code: errCode,
                message: errString,
              });
            } else {
              res({ name: _fileName });
            }
          } else {
            if (responseStr !== "") {
              this.generalSubject.next({
                type: "uploadError",
                responsString: responseStr,
              });
            }

            rej({
              code: errCode,
              message: errString,
            });
          }
        }
      );
    });
  }
}

export interface Device {
  deviceId: string;
  name: string;
  label: string;
  deviceInfo: any;
}

/**
 * Return the file filter for the save-file dialog based on the image type.
 * @param type The image type (number).
 */
function getDialogFilter(type: number): string {
  let filter;
  if (browserInfo.bMac) {
    switch (type) {
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_BMP:
        filter = "BMP";
        break;
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG:
        filter = "JPG,JPEG";
        break;
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG:
        filter = "PNG";
        break;
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF:
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_PDF:
        filter = "PDF";
        break;
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_TIF:
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_TIF:
        filter = "TIF,TIFF";
        break;
      default:
        filter = "TIF,TIFF,JPG,JPEG,PNG,PDF";
        break;
    }
  } else {
    switch (type) {
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_BMP:
        filter = "BMP(*.bmp)|*.bmp";
        break;
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG:
        filter = "JPG(*.jpg;*.jpeg)|*.jpg;*.jpeg";
        break;
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG:
        filter = "PNG(*.png)|*.png";
        break;
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF:
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_PDF:
        filter = "PDF(*.pdf)|*.pdf";
        break;
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_TIF:
      case Dynamsoft.DWT.EnumDWT_ImageType.IT_MULTIPAGE_TIF:
        filter = "TIF(*.tif;*.tiff)|*.tif;*.tiff";
        break;
      default:
        filter =
          "BMP,TIF,JPG,PNG,PDF|*.bmp;*.tif;*.png;*.jpg;*.pdf;*.tiff;*.jpeg";
        break;
    }
  }
  return filter;
}
