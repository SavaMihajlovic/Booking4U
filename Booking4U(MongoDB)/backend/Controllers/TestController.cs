
[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    private readonly IMongoClient _mongoClient;

    private readonly IMongoDatabase _database;

    public TestController(IConfiguration _configuration)
    {
        _mongoClient = new MongoClient(_configuration.GetConnectionString("MongoDB"));
        _database = _mongoClient.GetDatabase("Booking4U"); 
    }

    [HttpGet("TestConnection")]
    public async Task<ActionResult> TestConnection()
    {
        try
        {
            await _database.RunCommandAsync((Command<BsonDocument>)"{ping:1}");
            return Ok("Connected successfully to Booking4U!");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

}