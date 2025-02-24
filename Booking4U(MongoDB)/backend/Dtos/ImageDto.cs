public class ImageDto
{
    [FromForm]
    public IFormFile? Image { get; set; }
}