public class RoomDto
{
    [Range(1, 1000)]
    public required int RoomNumber { get; set; }

    [Length(5, 30)]
    public required string TypeOfRoom { get; set; }

    [Range(15, 100)]
    public required double PriceForNight { get; set; }

    public List<string>? Characteristics { get; set; }

    [MaxLength(200)]
    public required string Description { get; set; }

    [Range(1, 10)]
    public required int NumberOfPersons { get; set; }
}
