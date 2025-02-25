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
      
        catch(ExceptionWithCode ex)
        {
            return StatusCode((int)ex.ErrorCode, ex.Message);
        }
        
        catch (Exception ex)
        {
            return StatusCode(500 , $"Internal server error:{ex.Message}");
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
        
        catch(ExceptionWithCode ex)
        {
            return StatusCode((int)ex.ErrorCode, ex.Message);
        }
        
        catch (Exception ex)
        {
            return StatusCode(500 , $"Internal server error:{ex.Message}");
        }
    }
}