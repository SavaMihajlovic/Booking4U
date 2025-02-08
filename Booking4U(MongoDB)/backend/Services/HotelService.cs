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

    public async Task AddHotel(Hotel hotel, IFormFile image) 
    {
        if(image != null && image.Length > 0)
        {
            using var stream = new MemoryStream();
            await image.CopyToAsync(stream);
            hotel.Image = Convert.ToBase64String(stream.ToArray());
        }
        await _hotelCollection.InsertOneAsync(hotel);
    }
    public async Task<List<Hotel>> GetAllHotels() 
    {
        return await _hotelCollection.Find(_ => true).ToListAsync();
    }

    public async Task<List<Hotel>> GetPageHotels(int page)
    {
        int limitPage = 10;
        var hotels = await _hotelCollection.Find(h => true)
            .Skip((page - 1) * limitPage)  
            .Limit(limitPage)
            .ToListAsync();

        return hotels;
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
        await _hotelCollection.ReplaceOneAsync(h => h.Id == hotel.Id, hotel);
    }
    
    public async Task<List<Hotel>> GetHotelsWithAvgScore(string city , double score)
    {
       return await _hotelCollection.Find(h => h.City == city && h.Score >= score).ToListAsync();
    }

    public async Task<List<Hotel>> GetHotelsSortedByDistanceFromCenter(string city)
    {
        return await _hotelCollection.Find(h => h.City == city)
        .SortBy(h => h.CenterDistance)
        .ToListAsync();
    }

    public async Task<List<Hotel>> GetHolelsSortedByDistanceFromBeach(string city)
    {
        return await _hotelCollection.Find(h => h.City == city && h.BeachDistance!=null)
        .SortBy(h => h.BeachDistance)
        .ToListAsync();
    }
}