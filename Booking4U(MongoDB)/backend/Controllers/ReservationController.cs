
[ApiController]
[Route("[controller]")]
public class ReservationController : ControllerBase
{
    private readonly IMongoClient _mongoClient;
    private readonly IMongoDatabase _database;
    private readonly ReservationService _service;

    public ReservationController(IConfiguration _configuration)
    {
        _mongoClient = new MongoClient(_configuration.GetConnectionString("MongoDB"));
        _database = _mongoClient.GetDatabase("Booking4U");
        _service = new ReservationService(_database);         
    }

    [HttpPost("AddReservation/{userId}/{hotelId}")]
    public async Task<ActionResult> AddReservation(string userId , string hotelId , List<int> roomNumbers , DateTime checkInDate , DateTime checkOutDate)
    {
        try
        {
            if(string.IsNullOrEmpty(userId))
                return BadRequest("userId must not be empty");
            if(string.IsNullOrEmpty(hotelId))
                return BadRequest("hotelId must not be empty");
            await _service.AddReservations(userId, hotelId , roomNumbers , checkInDate, checkOutDate);
            return Ok($"Succesfully added reservations");
        }
        catch(ExceptionWithCode ex)
        {
            return StatusCode((int)ex.ErrorCode , ex.Message);
        }
        catch(Exception ex)
        {
            return StatusCode(500 , $"Internal server error:{ex.Message}");
        }
    }

    [HttpGet("GetUserReservations/{userId}")]
    public async Task<ActionResult> GetUserReservation(string userId)
    {
        try
        {
            if(string.IsNullOrEmpty(userId))
                return BadRequest("UserId was not listed");
            return Ok(await _service.GetUserReservations(userId));
        }
        catch(ExceptionWithCode ex)
        {
            return StatusCode((int)ex.ErrorCode , ex.Message);
        }
        catch(Exception ex)
        {
            return StatusCode(500 , $"Internal server error:{ex.Message}");
        }
    }

    [HttpGet("GetUserCurrentReservations/{userId}")]
    public async Task<ActionResult> GetUserCurrentReservations(string userId)
    {
        try
        {
            if(string.IsNullOrEmpty(userId))
                return BadRequest($"userId was not listed");
            return Ok(await _service.GetUserCurrentReservations(userId));
        }
        catch(ExceptionWithCode ex)
        {
            return StatusCode((int)ex.ErrorCode, ex.Message);
        }
        catch(Exception ex)
        {
            return StatusCode(500 , $"Internal server error:{ex.Message}");
        }
    }

    [HttpGet("GetAllReservations")]
    public async Task<ActionResult> GetAllReservations()
    {
        try
        {
            return Ok(await _service.GetAllReservations());
        }
        catch(Exception ex)
        {
            return StatusCode(500 , $"Internal server error:{ex.Message}");
        }
    }

    [HttpPost("GetTotalPrice/{hotelId}")]
    public async Task<ActionResult> GetTotalPrice(string hotelId, DateTime checkInDate, DateTime checkOutDate, List<int> roomNumbers)
    {
        try
        {
            if (string.IsNullOrEmpty(hotelId))
                return BadRequest("hotelId must not be empty.");

            return Ok(await _service.GetTotalPrice(hotelId, checkInDate, checkOutDate, roomNumbers));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error:{ex.Message}");
        }
    }

    [HttpPost("ValidateReservation/{userId}/{hotelId}/{ammount}")]
    public async Task<ActionResult> ValidateReservation(string userId, string hotelId, List<int> roomNumbers, DateTime checkInDate, DateTime checkOutDate, double ammount)
    {
        try
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("userId must not be empty");
            if (string.IsNullOrEmpty(hotelId))
                return BadRequest("hotelId must not be empty");
            if (roomNumbers == null || roomNumbers.Count == 0)
                return BadRequest("At least one room must be selected");
            
            await _service.ValidateReservation(userId, hotelId, roomNumbers, checkInDate, checkOutDate, ammount);
            return Ok("Validated succesfully!");
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
}