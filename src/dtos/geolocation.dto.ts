export class GeolocationDto {
    latitude?: string;
    longitude?: string;

    constructor(input: JsonObject) {
        if (!input) {
            return;
        }

        this.latitude = input['latitude'];
        this.longitude = input['longitude'];
    }
}
