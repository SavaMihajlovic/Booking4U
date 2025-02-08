
[ApiController]
[Route("[controller]")]
public class HotelController : ControllerBase
{
    private readonly IMongoClient _mongoClient;
    private readonly IMongoDatabase _database;
    private readonly HotelService _service;

    public HotelController(IConfiguration _configuration)
    {
        _mongoClient = new MongoClient(_configuration.GetConnectionString("MongoDB"));
        _database = _mongoClient.GetDatabase("Booking4U");
        _service = new HotelService(_configuration);         
    }

    [HttpPost("AddHotel")]
    public async Task<ActionResult> AddHotel ([FromForm] Hotel hotel, IFormFile image)
    {
        try
        {

            if (image == null || image.Length == 0) {
                return BadRequest("Image is required.");
            }

            var newHotel = new Hotel {
                Name = hotel.Name,
                City = hotel.City,
                Address = hotel.Address,
                Score = hotel.Score,
                Description = hotel.Description,
                Contact = hotel.Contact,
                CenterDistance = hotel.CenterDistance,
                BeachDistance = hotel.BeachDistance,
                Location = hotel.Location
            };

            await _service.AddHotel(newHotel,image);
            return Ok($"Hotel {hotel.Name} successfully added.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetAllHotels")]

    public async Task<ActionResult> GetAllHotels()
    {
        try
        {
            return Ok(await _service.GetAllHotels());
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetPageHotels/{page}")]
    public async Task<ActionResult> GetPageHotels(int page = 1)
    {
        try
        {
            if (page < 1)
                return BadRequest("Page must be greater than 0");
                
            return Ok(await _service.GetPageHotels(page));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetHotel/{id}")]

    public async Task<ActionResult> GetHotel(string id)
    {
        try
        {
            return Ok(await _service.GetHotel(id));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("DeleteHotel/{id}")]

    public async Task<ActionResult> DeleteHotel(string id)
    {
        try
        {
            await _service.DeleteHotel(id);
            return Ok($"Hotel ${id} has been successfully deleted.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("UpdateHotel")]

    public async Task<ActionResult> UpdateHotel([FromBody] Hotel hotel)
    {
        try
        {
            if(string.IsNullOrEmpty(hotel.Id))
            {
                return BadRequest("Id field missing");
            }
            await _service.UpdateHotel(hotel);
            return Ok($"Hotel ${hotel.Id} has been successfully updated.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [HttpGet("GetHotelsWithAvgScore/{city}/{score}")]
    public async Task<ActionResult> GetHotelsWithAvgScore(string city, double score)
    {
        try
        {   
            if(string.IsNullOrEmpty(city) || city.Length > 30)
                return BadRequest("City field must not be empty and max length is 30 characters");
            if(score <1 || score >5)
                return BadRequest($"Score must be between 1 and 5");
            return Ok(await _service.GetHotelsWithAvgScore(city , score));
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("GetHotelsSortedByDistanceFromCityCenter/{city}")]
    public async Task<ActionResult> GetHotelsSortedByDistanceFromCenter(string city)
    {
        try
        {
            if(string.IsNullOrEmpty(city) || city.Length > 30)
                return BadRequest("City field must not be empty and max length is 30 characters");
            return Ok(await _service.GetHotelsSortedByDistanceFromCenter(city));
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

      [HttpGet("GetHolelsSortedByDistanceFromBeach/{city}")]
    public async Task<ActionResult> GetHolelsSortedByDistanceFromBeach(string city)
    {
        try
        {
            if(string.IsNullOrEmpty(city) || city.Length > 30)
                return BadRequest("City field must not be empty and max length is 30 characters");
            return Ok(await _service.GetHolelsSortedByDistanceFromBeach(city));
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}