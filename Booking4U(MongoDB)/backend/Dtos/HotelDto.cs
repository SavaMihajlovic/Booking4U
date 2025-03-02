public class HotelDto {
    
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [Length(4,50)]
    public required string Name { get; set; }

    [MaxLength(30)]
    public required string Country { get; set;}

    [MaxLength(30)]
    public required string City { get; set;}

    [MaxLength(100)]
    public required string Address { get; set;}

    [Range(1,5)]
    public required double Score { get; set; }

    [MaxLength(100)]
    public required string Description { get; set;}

    [MaxLength(16)]
    public required string Contact { get; set;}

    [Range(0,10)]
    public required double CenterDistance { get; set; }

    [Range(0,10)]
    public double? BeachDistance { get; set; }

    [MaxLength(20)]
    public required string Location { get; set; }
}