[ApiController]
[Route("[controller]")]
public class RoomController : ControllerBase
{
    private readonly IMongoClient _mongoClient;
    private readonly IMongoDatabase _database;
    private readonly RoomService _service;

    public RoomController(IConfiguration _configuration)
    {
        _mongoClient = new MongoClient(_configuration.GetConnectionString("MongoDB"));
        _database = _mongoClient.GetDatabase("Booking4U");
        _service = new RoomService(_database);         
    }

    [HttpPost("AddRoom")]
    public async Task<ActionResult> AddRoom([FromBody] Room room)
    {
        try
        {
            await _service.AddRoom(room);
            return Ok($"Room has been added succesfully");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("GetRoom/{id}")]
    public async Task<ActionResult> GetRoom(string id)
    {
        try
        {
            return Ok(await _service.GetRoom(id));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("GetAllRooms")]
    public async Task<ActionResult> GetAllRooms()
    {
        try
        {
            return Ok(await _service.GetAllRooms());
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("DeleteRoom/{id}")]
    public async Task<ActionResult> DeleteRoom(string id)
    {
        try
        {
             await _service.DeleteRoom(id);
             return Ok($"Room with id:{id} has been succesfully deleted");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("UpdateRoom")]
    public async Task<ActionResult> UpdateRoom([FromBody]Room room)
    {
        try
        {
             await _service.UpdateRoom(room);
             return Ok($"Room with id:{room.Id} has been succesfully updated");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("AddRoomToHotel/{roomId}/{hotelId}")]
    public async Task<ActionResult> AddRoomToHotel(string roomId , string hotelId)
    {
        try
        {
            await _service.AddRoomToHotel(roomId, hotelId);
            return Ok($"Room with id:{roomId} has been added to Hotel with id:{hotelId}");
        }
        catch (Exception ex){
            return BadRequest(ex.Message);
        }
    }
    
    [HttpGet("GetAllRoomsFromHotel/{hotelId}")]
    public async Task<ActionResult> GetAllRoomsFromHotel(string hotelId)
    {
        try
        {
            return Ok(await _service.GetAllRoomsFromHotel(hotelId));
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpGet("GetAllAvailableRoomsFromHotel/{hotelId}")]
    public async Task<ActionResult> GetAllAvailableRoomsFromHotel(string hotelId)
    {
        try
        {
            return Ok(await _service.GetAllAvailableRoomsFromHotel(hotelId));
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetAllAvailableRoomsFromHotelWithMaxPrice/{hotelId}/{maxPrice}")]
    public async Task<ActionResult> GetAllAvailableRoomsFromHotelWithMaxPrice(string hotelId , double maxPrice)
    {
        try
        {
            if(string.IsNullOrEmpty(hotelId))
                return BadRequest("hotelId field is required");
            if(maxPrice < 0)
                return BadRequest("maxPrice must be positive");
            return Ok(await _service.GetAllAvailableRoomsFromHotelWithMaxPrice(hotelId , maxPrice));
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}