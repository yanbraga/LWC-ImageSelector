import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// Import the images from Static Resources
import imageMerlot from '@salesforce/resourceUrl/merlotImage';
import imageChardonnay from '@salesforce/resourceUrl/chardonnayImage';
import imageCabernet from '@salesforce/resourceUrl/cabernetImage';

export default class ImageSelector extends LightningElement {

    @track selectedFruit = null;
    @track grapeType = '';
    @track tonnesOfGrapes = '';
    @track entryDate = '';
    @track description = '';

    fruits = [
        { name: 'Merlot', sfImage: imageMerlot, selected: false },
        { name: 'Chardonnay', sfImage: imageChardonnay, selected: false },
        { name: 'Cabernet', sfImage: imageCabernet, selected: false },
    ];

    handleImageSelect(event) {
        const selectedName = event.currentTarget.dataset.name;
        const selectedImage = event.currentTarget.querySelector('img');
    
        // Update the selection state for all fruits and apply the style only to the selected image.
        this.fruits = this.fruits.map((fruit) => {
            if (fruit.name === selectedName) {
                fruit.selected = true;
                this.selectedFruit = fruit;
                this.grapeType = fruit.name;
                selectedImage.classList.add('selected-image');
            } else {
                fruit.selected = false;
                const image = this.template.querySelector(`[data-name="${fruit.name}"] img`);
                if (image) {
                    image.classList.remove('selected-image');
                }
            }
            return fruit;
        });
    
        
        this.grapeType = selectedName;
    }
    

    handleTonnesChange(event) {
        this.tonnesOfGrapes = event.target.value;
    }

    handleEntryDateChange(event) {
        this.entryDate = event.target.value;
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
    }

    handleFinish() {
        // Check if an image is selected
        if (!this.selectedFruit) {
            this.showNotification('Please select a grape variety before proceeding.', 'error');
            return;
        }
    
    
        const formattedEntryDate = `${this.entryDate}T00:00:00.000Z`;
    
        // Create a new record in the 'Fruits' object with the filled information
        const fields = {
            Name: this.selectedFruit.name,
            grapeType__c: this.selectedFruit.name,
            tonnesGrapes__c: this.tonnesOfGrapes,
            Entrydate__c: formattedEntryDate, // Use a data formatada
            Description__c: this.description,
        };
    
        const recordInput = { apiName: 'Fruit__c', fields };
        createRecord(recordInput)
            .then((result) => {
                // Success
                console.log('Record created successfully:', result.id);
                this.showNotification('Record created successfully.', 'success');
            })
            .catch((error) => {
                //  Error
                console.error('Error while creating the record:', error);
                this.showNotification('Could not create record.', 'error');
            });

             
    }

    handleReset() {
        // Clear all information by setting the initial values
        this.selectedFruit = null;
        this.tonnesOfGrapes = '';
        this.entryDate = '';
        this.description = '';
    
        // Clear the image selection by removing the 'selected-image' 
        const selectedImage = this.template.querySelector('.selected-image');
        if (selectedImage) {
            selectedImage.classList.remove('selected-image');
        }
    
        // Clear the selection state for all "fruits"
        this.fruits = this.fruits.map((fruit) => {
            fruit.selected = false;
            return fruit;
        });
    }
    

    showNotification(message, variant) {
        const event = new ShowToastEvent({
            
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
