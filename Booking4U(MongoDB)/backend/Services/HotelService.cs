public class HotelService {
    private readonly IMongoCollection<Hotel> _hotelsCollection;

    public HotelService(IMongoDatabase database) 
    {
        _hotelsCollection = database.GetCollection<Hotel>("hotels_collection");
    }

    public async Task<Hotel> GetHotel(string id) 
    {
        var hotel = await _hotelsCollection.Find(h => h.Id == id).FirstOrDefaultAsync() ?? 
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
        await _hotelsCollection.InsertOneAsync(hotel);
    }
    public async Task<List<Hotel>> GetAllHotels() 
    {
        return await _hotelsCollection.Find(_ => true).ToListAsync();
    }

    public async Task<List<Hotel>> GetPageHotels(int page)
    {
        int limitPage = 10;
        int skip = (page - 1) * limitPage;
        var hotels = await _hotelsCollection.Find(h => true)
            .Skip(skip)  
            .Limit(limitPage)
            .ToListAsync();

        return hotels;
    }

    public async Task DeleteHotel(string id)
    {
        var hotel = await _hotelsCollection.Find(h => h.Id == id).FirstOrDefaultAsync() ?? 
        throw new Exception($"Hotel with id:{id} not found");
        await _hotelsCollection.DeleteOneAsync(h => h.Id == hotel.Id);
    }

       public async Task UpdateHotel(Hotel hotel) 
    {
        var hotelExists = await _hotelsCollection.Find(h => h.Id == hotel.Id).FirstOrDefaultAsync() ?? 
        throw new Exception($"Hotel with id:{hotel.Id} not found");
        await _hotelsCollection.ReplaceOneAsync(h => h.Id == hotel.Id, hotel);
    }
    
    public async Task<List<Hotel>> GetHotelsWithAvgScore(string city , double score)
    {
       return await _hotelsCollection.Find(h => h.City == city && h.Score >= score).ToListAsync();
    }

    public async Task<List<Hotel>> GetHotelsSortedByDistanceFromCenter(string city)
    {
        return await _hotelsCollection.Find(h => h.City == city)
        .SortBy(h => h.CenterDistance)
        .ToListAsync();
    }

    public async Task<List<Hotel>> GetHolelsSortedByDistanceFromBeach(string city)
    {
        return await _hotelsCollection.Find(h => h.City == city && h.BeachDistance!=null)
        .SortBy(h => h.BeachDistance)
        .ToListAsync();
    }

    public async Task<List<Hotel>> GetHotelsFilter(FilterRequest filterRequest)
    {
        int limitPage = 10;
        int skip = (filterRequest.Page - 1) * limitPage;

        var hotelFilters = new List<FilterDefinition<Hotel>>();
        var roomFilters = new List<FilterDefinition<Room>>();

        // Hotel filters

        if(!string.IsNullOrEmpty(filterRequest.City))
        hotelFilters.Add(Builders<Hotel>.Filter.Eq(h => h.City, filterRequest.City));

        if(filterRequest.Score.HasValue && filterRequest.Score.Value >= 1 && filterRequest.Score.Value <= 5)
        hotelFilters.Add(Builders<Hotel>.Filter.Gte(h => h.Score, filterRequest.Score.Value));

        if(filterRequest.CenterDistance.HasValue && filterRequest.CenterDistance.Value >= 0 && filterRequest.CenterDistance <= 10)
        hotelFilters.Add(Builders<Hotel>.Filter.Lte(h => h.CenterDistance, filterRequest.CenterDistance.Value));

        // Room filters

        if(!string.IsNullOrEmpty(filterRequest.TypeOfRoom))
        roomFilters.Add(Builders<Room>.Filter.Eq(r => r.TypeOfRoom, filterRequest.TypeOfRoom));

        if (filterRequest.PriceForNight.HasValue)
            roomFilters.Add(Builders<Room>.Filter.Lte(r => r.PriceForNight, filterRequest.PriceForNight.Value));

        var roomFilter = roomFilters.Count > 0 ? Builders<Hotel>.Filter.ElemMatch(h => h.Rooms, Builders<Room>.Filter.And(roomFilters)) : Builders<Hotel>.Filter.Empty;

        if (roomFilters.Count > 0)
        {
            hotelFilters.Add(roomFilter);
        }

        var hotelFilter = hotelFilters.Count > 0 ? Builders<Hotel>.Filter.And(hotelFilters) : Builders<Hotel>.Filter.Empty;
        return await _hotelsCollection.Find(hotelFilter)
            .Skip(skip)
            .Limit(limitPage)
            .ToListAsync();
    }

    public async Task<List<string>> GetAllCities(string countryName)
    {
        var filter = Builders<Hotel>.Filter.Eq(h => h.Country, countryName);
        var cities = await _hotelsCollection
            .Distinct<string>("City", filter)
            .ToListAsync();
        
        return cities;
    }

    public async Task<List<string>> GetAllCountries()
    {
        var contries = await _hotelsCollection
        .Distinct<string>("Country", Builders<Hotel>.Filter.Empty)
        .ToListAsync();
        return contries;
    }

    
    public async Task AddRoomsToHotel(string hotelId , List<Room> rooms)
    {
       var hotel = await _hotelsCollection.Find(h => h.Id == hotelId).FirstOrDefaultAsync() ??
       throw new Exception($"Hotel with id:{hotelId} does not exist.");



       if(rooms.Count > 0)
       {
            hotel.Rooms ??= [];
            foreach(Room room in rooms)
            {
                var roomExists = hotel.Rooms.Any(r => r.RoomNumber == room.RoomNumber);
                if(roomExists)
                    throw new Exception("Room number already taken");
                hotel.Rooms.Add(room);
            }
            await _hotelsCollection.ReplaceOneAsync(h => h.Id == hotelId , hotel);
       }
       else
            throw new Exception($"No rooms have been listed.");

        
    }


    
    public async Task<List<Room>> GetAllRoomsFromHotel(string hotelId)
    {
        var hotel = await _hotelsCollection.Find(h => h.Id == hotelId).FirstOrDefaultAsync() ??
        throw new Exception($"Hotel with id:{hotelId} not found");

        if(hotel.Rooms == null) return [];
        return hotel.Rooms;
    }
    
    
    public async Task<List<string>> GetAllRoomTypes()
    {
        var types = await _hotelsCollection
        .Distinct<string>("Rooms.TypeOfRoom",FilterDefinition<Hotel>.Empty)
        .ToListAsync();
        return types;
    }
    
}