public class HotelService {
    private readonly IMongoCollection<Hotel> _hotelCollection;
    public HotelService(IConfiguration configuration) 
    {
        var mongoClient = new MongoClient(configuration.GetConnectionString("MongoDB"));
        var database = mongoClient.GetDatabase("Booking4U"); 
        _hotelCollection = database.GetCollection<Hotel>("hotels_collection");
    }

    public async Task<Hotel> GetHotel(string id) 
    {
        var hotel = await _hotelCollection.Find(h => h.Id == id).FirstOrDefaultAsync() ?? 
        throw new Exception($"Hotel with id:{id} not found");
        return hotel;
    }

    public async Task AddHotel(Hotel hotel) 
    {
        await _hotelCollection.InsertOneAsync(hotel);
    }
    public async Task<List<Hotel>> GetAllHotels() 
    {
        return await _hotelCollection.Find(_ => true).ToListAsync();
    }

    public async Task DeleteHotel(string id)
    {
        var hotel = await _hotelCollection.Find(h => h.Id == id).FirstOrDefaultAsync() ?? 
        throw new Exception($"Hotel with id:{id} not found");
        await _hotelCollection.DeleteOneAsync(h => h.Id == hotel.Id);
    }

    public async Task UpdateHotel(Hotel hotel) 
    {
        var hotelExists = await _hotelCollection.Find(h => h.Id == hotel.Id).FirstOrDefaultAsync() ?? 
        throw new Exception($"Hotel with id:{hotel.Id} not found");
        var result = await _hotelCollection.ReplaceOneAsync(h => h.Id == hotel.Id, hotel);
    }
}