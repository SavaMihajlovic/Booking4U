
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
        _service = new HotelService(_database);         
    }

    [HttpPost("AddHotel")]
    public async Task<ActionResult> AddHotel ([FromForm] Hotel hotel, IFormFile image)
    {
        try
        {
            if (image == null || image.Length == 0) {
                return BadRequest("Image is required.");
            }

            await _service.AddHotel(hotel,image);
            return Ok($"Hotel {hotel.Name} successfully added.");
        }
        catch (Exception ex)
        {
            return StatusCode(500 , $"Internal server error:{ex.Message}");
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
        catch(ExceptionWithCode ex)
        {
            return StatusCode((int)ex.ErrorCode, ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500 , $"Internal server error:{ex.Message}");
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
        catch(ExceptionWithCode ex)
        {
            return StatusCode((int)ex.ErrorCode, ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500 , $"Internal server error:{ex.Message}");
        }
    }
    

    [HttpPut("UpdateHotel")]

    public async Task<ActionResult> UpdateHotel([FromBody] HotelDto hotelDto)
    {
        try
        {
            if(string.IsNullOrEmpty(hotelDto.Id))
            {
                return BadRequest("Id field missing");
            }
            await _service.UpdateHotel(hotelDto);
            return Ok($"Hotel ${hotelDto.Id} has been successfully updated.");
        }

        catch(ExceptionWithCode ex)
        {
            return StatusCode((int)ex.ErrorCode, ex.Message);
        }

        catch (Exception ex)
        {
            return StatusCode(500 , $"Internal server error:{ex.Message}");
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

    [HttpGet("GetHotelsFilter")]
    public async Task<ActionResult> GetHotelsFilter([FromQuery] FilterRequest filterRequest)
    {
        try
        {
            if (filterRequest.Page < 1)
                return BadRequest("Invalid page");
            
            return Ok(await _service.GetHotelsFilter(filterRequest));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    
    [HttpGet("GetAllCities/{countryName}")]
    public async Task<ActionResult> GetAllCities(string countryName)
    {
        try
        {
            return Ok(await _service.GetAllCities(countryName));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetAllCountries")]
    public async Task<ActionResult> GetAllCountries()
    {
        try
        {
            return Ok(await _service.GetAllCountries());
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("AddRoomToHotel/{hotelId}")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult> AddRoomToHotel(string hotelId, [FromForm] RoomDto roomDto, [FromForm] List<IFormFile> images)
    {
        try
        {
            if (string.IsNullOrEmpty(hotelId))
                return BadRequest("No hotel has been listed");

            if (roomDto == null)
            return BadRequest("No room has been provided");

            if (images == null || images.Count == 0)
            return BadRequest("No images have been provided");

            await _service.AddRoomToHotel(hotelId, roomDto, images);
            return Ok("Rooms have been added to hotel");
        }
        catch (ExceptionWithCode ex)
        {
            return StatusCode((int)ex.ErrorCode, ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("GetAllRoomsFromHotel/{hotelId}")]
    
    public async Task<ActionResult> GetAllRoomsFromHotel(string hotelId)
    {
        try{
            if(string.IsNullOrEmpty(hotelId))
                return BadRequest("No hotel has been listed");
            return Ok(await _service.GetAllRoomsFromHotel(hotelId));
        }
       
        catch(ExceptionWithCode ex)
        {
            return StatusCode((int)ex.ErrorCode, ex.Message);
        }
        
        catch (Exception ex)
        {
            return StatusCode(500 , $"Internal server error:{ex.Message}");
        }
    }
    [HttpGet("GetAllRoomTypes")]
    public async Task<ActionResult> GetAllRoomTypes()
    {
        try
        {
            return Ok(await _service.GetAllRoomTypes());
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}