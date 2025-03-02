public class HotelService {
    private readonly IMongoCollection<Hotel> _hotelsCollection;

    public HotelService(IMongoDatabase database) 
    {
        _hotelsCollection = database.GetCollection<Hotel>("hotels_collection");
    }

    public async Task<Hotel> GetHotel(string id) 
    {
        var hotel = await _hotelsCollection.Find(h => h.Id == id).FirstOrDefaultAsync() ?? 
        throw new ExceptionWithCode(ErrorCode.NotFound,$"Hotel with id:{id} not found");
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
        throw new ExceptionWithCode(ErrorCode.NotFound, $"Hotel with id:{id} not found");
        await _hotelsCollection.DeleteOneAsync(h => h.Id == hotel.Id);
    }

    public async Task UpdateHotel(HotelDto hotelDto)
    {
        var updateDefinition = Builders<Hotel>.Update
            .Set(h => h.Name, hotelDto.Name)
            .Set(h => h.Country, hotelDto.Country)
            .Set(h => h.City, hotelDto.City)
            .Set(h => h.Address, hotelDto.Address)
            .Set(h => h.Score, hotelDto.Score)
            .Set(h => h.Description, hotelDto.Description)
            .Set(h => h.Contact, hotelDto.Contact)
            .Set(h => h.CenterDistance, hotelDto.CenterDistance)
            .Set(h => h.BeachDistance, hotelDto.BeachDistance)
            .Set(h => h.Location, hotelDto.Location);

        var result = await _hotelsCollection.UpdateOneAsync(
            h => h.Id == hotelDto.Id,
            updateDefinition
        );

        if (result.ModifiedCount == 0)
        {
            throw new ExceptionWithCode(ErrorCode.NotFound, $"Hotel with id:{hotelDto.Id} not found");
        }
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

    
   public async Task AddRoomToHotel(string hotelId, RoomDto roomDto, List<IFormFile> images)
    {
        var hotel = await _hotelsCollection
            .Find(h => h.Id == hotelId)
            .FirstOrDefaultAsync() 
            ?? throw new ExceptionWithCode(ErrorCode.NotFound, $"Hotel with id:{hotelId} not found");

        List<string> imageBase64List = [];
        foreach (var image in images)
        {
            using var stream = new MemoryStream();
            await image.CopyToAsync(stream);
            imageBase64List.Add(Convert.ToBase64String(stream.ToArray()));
        }

        var room = new Room
        {
            RoomNumber = roomDto.RoomNumber,
            TypeOfRoom = roomDto.TypeOfRoom,
            PriceForNight = roomDto.PriceForNight,
            Characteristics = roomDto.Characteristics,
            Description = roomDto.Description,
            NumberOfPersons = roomDto.NumberOfPersons,
            Images = imageBase64List 
        };

        hotel.Rooms ??= [];

        hotel.Rooms.Add(room);
        
        await _hotelsCollection.ReplaceOneAsync(h => h.Id == hotel.Id, hotel);
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