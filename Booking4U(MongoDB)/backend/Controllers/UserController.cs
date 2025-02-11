[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IMongoClient _mongoClient;
    private readonly IMongoDatabase _database;
    private readonly UserService _service;

    public UserController(IConfiguration _configuration)
    {
        _mongoClient = new MongoClient(_configuration.GetConnectionString("MongoDB"));
        _database = _mongoClient.GetDatabase("Booking4U");
        _service = new UserService(_configuration , _database);         
    }

    [HttpPost("Register")]
    public async Task<ActionResult> Register ([FromBody] User user)
    {
        try
        {
            await _service.Register(user);
            return Ok($"User successfully added.");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost("Login/{email}/{password}")]
    public async Task<ActionResult> Login(string email, string password)
    {
        try
        {
            var token = await _service.Login(email, password);
            return Ok(token);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("AddReservations/{userId}/{hotelId}")]
    public async Task<ActionResult> AddReservations(string userId , string hotelId , [FromBody] List<int> roomNumbers)
    {
        try
        {
            if(string.IsNullOrEmpty(userId))
                return BadRequest($"user is not listed");
            if(string.IsNullOrEmpty(hotelId))
                return BadRequest($"hotel is not listed");
            if(roomNumbers.Count == 0)
                return BadRequest("rooms are not listed");
            await _service.AddReservations(userId , hotelId, roomNumbers);
            return Ok("Reservations have been made");
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    
}