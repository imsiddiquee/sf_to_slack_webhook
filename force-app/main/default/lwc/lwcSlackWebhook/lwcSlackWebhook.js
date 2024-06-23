import { LightningElement, track } from 'lwc';
import publishMessage from '@salesforce/apex/SlackFileUploadController2.WebhookPublishMessageToSlack';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LwcSlackWebhook extends LightningElement {
    formData = {
        
    };

    @track processing=false;
    @track uploadDisabled =true;

  

    changeHandler(event) {
        const { name, value, checked, type } = event.target;
        const isCheckbox = type === 'checkbox' || type === 'checkbox-button' || type === 'toggle';
        this.formData = { ...this.formData, [name]: isCheckbox ? checked : value };

        this.uploadDisabled = !this.formData.textarea_2;
    }

    async submitHandler(event) {
        event.preventDefault();
        console.log("Form Data", JSON.stringify(this.formData));
        this.processing=true;
        let publishInfo;
        try {
            const messageResponse = await publishMessage({ msg:this.formData.textarea_2});
            publishInfo = JSON.parse(messageResponse);            
            this.handleClear();
        } catch (error) {
            console.log('error-->',error);
            
        }

        this.processing=false;
        // Notify the user of success        
        this.dispatchEvent(
            new ShowToastEvent({
                title: publishInfo.status === 'OK'?'Success': 'Error',
                message: publishInfo.message,
                variant: publishInfo.status === 'OK'?'success': 'error'
            })
        );
    }

    handleClear(event)
    {
        this.template.querySelector('[data-id="message"]').value='';
        this.uploadDisabled =true;
    }
}