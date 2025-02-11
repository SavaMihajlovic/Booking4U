public class Reservation {

    public required List<Room> Rooms { get; set; }
    
    [Range(0,5000)]
    public required double TotalPrice { get; set; }


}