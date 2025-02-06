public class RoomService {
    private readonly IMongoCollection<Room> _roomCollection;
    private readonly IMongoCollection<Hotel> _hotelCollection;
    public RoomService(IMongoDatabase database) 
    {
        _roomCollection = database.GetCollection<Room>("rooms_collection");
        _hotelCollection = database.GetCollection<Hotel>("hotels_collection");
    }

    public async Task AddRoom(Room room)
    {
        await _roomCollection.InsertOneAsync(room);
    }

    public async Task<List<Room>> GetAllRooms()
    {
         return await _roomCollection.Find(_ => true).ToListAsync();
    }

    public async Task<Room> GetRoom(string id)
    {
        var room = await _roomCollection.Find(r => r.Id == id).FirstOrDefaultAsync() ??
        throw new Exception($"Room with id:{id} is not found");
        return room;
    }
    public async Task DeleteRoom(string id)
    {
        var room = await _roomCollection.Find(r => r.Id == id).FirstOrDefaultAsync() ?? 
        throw new Exception($"Room with id:{id} not found");
        await _roomCollection.DeleteOneAsync(r => r.Id == id);
    }

    public async Task UpdateRoom(Room room) 
    {
        var roomExists = await _roomCollection.Find(r => r.Id == room.Id).FirstOrDefaultAsync() ?? 
        throw new Exception($"Room with id:{room.Id} not found");

        await _roomCollection.ReplaceOneAsync(r => r.Id == room.Id, room);
    }

    public async Task AddRoomToHotel(string roomId, string hotelId)
    {
        var roomExists = await _roomCollection.Find(r => r.Id == roomId).FirstOrDefaultAsync() ?? 
        throw new Exception($"Room with id:{roomId} not found");
        
        var hotel = await _hotelCollection.Find(h => h.Id == hotelId).FirstOrDefaultAsync() ??
        throw new Exception($"Hotel with id:{hotelId} not found");

        if(hotel.Rooms == null) {
            hotel.Rooms = new List<Room>();
        }
            hotel.Rooms.Add(roomExists);

        await _hotelCollection.ReplaceOneAsync(h => h.Id == hotel.Id, hotel);
    }

    public async Task<List<Room>> GetAllRoomsFromHotel(string hotelId)
    {
        var hotel = await _hotelCollection.Find(h => h.Id == hotelId).FirstOrDefaultAsync() ??
        throw new Exception($"Hotel with id:{hotelId} not found");

        if(hotel.Rooms == null) return [];
        return hotel.Rooms;
    }

    public async Task<List<Room>> GetAllAvailableRoomsFromHotel(string hotelId)
    {
        var hotel = await _hotelCollection.Find(h => h.Id == hotelId).FirstOrDefaultAsync() ??
        throw new Exception($"Hotel with id:{hotelId} not found");

        if(hotel.Rooms == null) return [];
        return hotel.Rooms.Where(h => h.Availability == true).ToList();

    }

    public async Task<List<Room>> GetAllAvailableRoomsFromHotelWithMaxPrice(string hotelId , double maxPrice)
    {
        var hotel = await _hotelCollection.Find(h => h.Id == hotelId).FirstOrDefaultAsync() ??
        throw new Exception($"Hotel with id:{hotelId} not found");

        if(hotel.Rooms == null) return [];
        return hotel.Rooms.Where(h => h.Availability == true && h.PriceForNight <= maxPrice).ToList();
    }




}