declare var Dynamsoft: any;
import { getInputEl } from './common';
import type { DwtUIOperations } from './dwtUIOperations';

export class RemoveCurrentPageDialog {

  protected bNotShowMessageAgain: boolean;
  protected dwtUtil: DwtUIOperations;

  constructor(dwtUtil: DwtUIOperations) {

    this.dwtUtil = dwtUtil; 
    this.bNotShowMessageAgain = false;

  }

  remove() {
    
    if(!this.dwtUtil.checkIfImagesInBuffer()) {
      return;
    }
    
    if (this.bNotShowMessageAgain) {
      this.dwtUtil.removeCurrentImage();
    } else {
      let title = 'Are you sure to delete current page?';
      let ObjString = [
        '<div class="dynamsoft-dwt-header"></div>',
        '<div class="dynamsoft-dwt-dlg-title">',
        title,
        '</div>'];

      ObjString.push("<div class='dynamsoft-dwt-showMessage'><label class='dynamsoft-dwt-showMessage-detail' for = 'showMessage'><input type='checkbox' id='showMessage'/>Don't show this message again.&nbsp;</label></div>");
      ObjString.push('<div class="dynamsoft-dwt-installdlg-buttons"><input id="btnDelete" class="button-yes" type="button" value="Yes" /><input id="btnCancel" class="button-no" type="button" value="No" /> </div>');
      Dynamsoft.DWT.ShowDialog(500, 0, ObjString.join(''), true, false);

      let btnDelete = getInputEl('btnDelete');
      btnDelete?.addEventListener('click', ()=>{
        
        let showMessage = getInputEl("showMessage");
        if (showMessage && showMessage.checked)
          this.bNotShowMessageAgain = true;

          this.dwtUtil.removeCurrentImage();
        Dynamsoft.DWT.CloseDialog();
      });

      let btnCancel = getInputEl('btnCancel');
      btnCancel?.addEventListener('click', ()=>{

        let showMessage = getInputEl("showMessage");
        if (showMessage && showMessage.checked)
          this.bNotShowMessageAgain = true;
        Dynamsoft.DWT.CloseDialog();
      });
    }

  }
}