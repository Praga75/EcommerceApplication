import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
// import { } from '@types/googlemaps';

@Component({
    selector: 'GoogleMapComponent',
    template: `<mat-form-field class="google-places">
    <mat-label> Address </mat-label>
      <input matInput class="input"
        type="text"
        [(ngModel)]="autocompleteInput"
        #addresstext
        ></mat-form-field>
    `,
})
export class GoogleMapComponent implements OnInit, AfterViewInit {
    @Input() addressType: string;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    @ViewChild('addresstext', { static: false }) addresstext: any;

    autocompleteInput: string;
    queryWait: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.getPlaceAutocomplete();
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
            {
                // componentRestrictions: { country: 'US' },
                types: [this.addressType]  // 'establishment' / 'address' / 'geocode'
            });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.invokeEvent(place);
        });
    }

    invokeEvent(place: Object) {
        this.setAddress.emit(place);
    }

}