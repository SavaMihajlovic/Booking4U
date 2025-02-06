public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    [MaxLength(30)]
    public required string FirstName { get; set; }
    [MaxLength(30)]
    public required string LastName { get; set; }
    [MaxLength(80)]
    public required string Email { get; set; }
    [Length(10, 30)]
    public required string Password { get; set; }
    [MaxLength(20)]
    public required string PhoneNumber { get; set; }
    [MaxLength(13)]
    public string? JMBG { get; set; }
    [MaxLength(10)]
    public required string TypeOfUser { get; set; }
}