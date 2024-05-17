import { GeolocationDto } from './geolocation.dto';

export class PlaceDto {
    place_id?: string;
    display_address?: string;
    vicinity?: string;
    street_number?: string;
    street_name?: string;
    postal_code?: string;
    locality?: string;
    sublocality?: string;
    state?: string;
    country?: string;
    geolocation?: GeolocationDto;

    constructor(input: JsonObject) {
        if (!input) {
            return;
        }

        this.place_id = input['place_id'];
        this.display_address = input['display_address'];
        this.vicinity = input['vicinity'];
        this.street_number = input['street_number'];
        this.street_name = input['street_name'];
        this.postal_code = input['postal_code'];
        this.locality = input['locality'];
        this.sublocality = input['sublocality'];
        this.state = input['state'];
        this.country = input['country'];
        this.geolocation = input['geolocation']
            ? new GeolocationDto(input['geolocation'])
            : undefined;
    }
}
