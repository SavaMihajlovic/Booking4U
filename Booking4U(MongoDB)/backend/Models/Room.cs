

public class Room 
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set;}
    [Length(5,30)]
    public required string TypeOfRoom { get; set; }
    [Range(15,100)]
    public required double PriceForNight { get; set; }
    [DefaultValue(true)]
    public required bool Availability { get; set; }

    public required Characteristics Characteristics { get; set; }
    
    public string? HotelId { get; set;}
}