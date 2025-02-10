public class FilterRequest
{
    [MaxLength(30)]
    public string? City { get; set;}

    [Range(1,5)]
    public double? Score { get; set; }

    [Range(0,10)]
    public double? CenterDistance { get; set; }

    [Length(5,30)]
    public string? TypeOfRoom { get; set; }

    [Range(15,100)]
    public double? PriceForNight { get; set; }

    [DefaultValue(1)]
    public int Page { get; set; }
}