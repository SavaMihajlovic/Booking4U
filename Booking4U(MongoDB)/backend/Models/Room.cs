public class Room 
{
    [Range(1,1000)]
    public required int RoomNumber { get; set; }
    [Length(5,30)]
    public required string TypeOfRoom { get; set; }
    [Range(15,100)]
    public required double PriceForNight { get; set; }

    //lista slika

    //pogodnosti

    //deskripcija

    //broj osoba
}