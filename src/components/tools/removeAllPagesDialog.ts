declare var Dynamsoft: any;
import { getInputEl } from './common';
import { DwtUIOperations } from './dwtUIOperations';

export class RemoveAllPagesDialog {

  protected dwtUtil: DwtUIOperations;
  constructor(dwtUtil: DwtUIOperations) {
    this.dwtUtil = dwtUtil;
  }

  removeAll() {

    if(!this.dwtUtil.checkIfImagesInBuffer()) {
      return;
    }

    let ObjString = [
      '<div class="dynamsoft-dwt-header"></div>',
      '<div class="dynamsoft-dwt-dlg-title">',
      'Are you sure to delete all pages?',
      '</div>'];

    ObjString.push('<div class="dynamsoft-dwt-installdlg-iconholder"><input id="btnDeleteForRemoveAll" class="button-yes" type="button" value="Yes" /><input id="btnCancelForRemoveAll" class="button-no" type="button" value="No" /> </div>');
    Dynamsoft.DWT.ShowDialog(500, 0, ObjString.join(''), true, false);

    let btnDeleteAll = getInputEl('btnDeleteForRemoveAll');
    btnDeleteAll?.addEventListener('click', () => {

      this.dwtUtil.removeAllImages();
      Dynamsoft.DWT.CloseDialog();
    });

    let btnCancel = getInputEl('btnCancelForRemoveAll');
    btnCancel?.addEventListener('click', () => {
      Dynamsoft.DWT.CloseDialog();
    });

  }
}