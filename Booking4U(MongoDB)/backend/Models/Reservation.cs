public class Reservation {

    [MaxLength(30)]
    public required string UserId { get; set; }
    
    [MaxLength(30)]
    public required string RoomId { get; set; }


}