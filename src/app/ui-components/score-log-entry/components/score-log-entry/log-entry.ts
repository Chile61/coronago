export class LogEntry {
    public contactScore;
    public contactTime;
    public contactTimeReadable;
    public contactLocation?: ContactLocation;
    public scoreAccumulated: number;
}

export class ContactLocation {
    public lng?: string;
    public lat?: string;

    constructor(lng, lat) {
        this.lng = lng;
        this.lat = lat;
    }
}
