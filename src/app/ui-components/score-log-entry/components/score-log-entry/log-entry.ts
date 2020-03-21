export class LogEntry {
    public contactScore;
    public contactTime;
    public contactTimeReadable;
    public contactLocation?: ContactLocation;
    public scoreAccumulated: number;
}

export class ContactLocation {
    public lon?: string;
    public lat?: string;
}
