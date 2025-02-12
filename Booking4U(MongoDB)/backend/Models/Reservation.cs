public class Reservation {

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public required List<Room> Rooms { get; set; }
    
    [Range(0,5000)]
    public required double TotalPrice { get; set; }

    public required DateTime CheckInDate { get; set; }

    public required DateTime CheckOutDate { get; set; }

}