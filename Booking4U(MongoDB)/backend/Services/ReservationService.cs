public class ReservationService 
{
    private readonly IMongoCollection<Reservation> _reservationsCollection;
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMongoCollection<Hotel> _hotelsCollection;

    public ReservationService(IMongoDatabase database)
    {
        _reservationsCollection = database.GetCollection<Reservation>("reservations_collection");
        _usersCollection = database.GetCollection<User>("users_collection");
        _hotelsCollection = database.GetCollection<Hotel>("hotels_collection");
    }

    public async Task AddReservations(string userId , string hotelId , List<int> roomNumbers , DateTime checkInDate , DateTime checkOutDate)
    {
        if(checkInDate.Date >= checkOutDate.Date)
            throw new ExceptionWithCode(ErrorCode.BadRequest,$"checkoutDate must be after checkInDate and minimum diference must be atleast one day");

        var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync() ??
        throw new ExceptionWithCode(ErrorCode.NotFound,$"user:{userId} does not exist");
        
        if(roomNumbers == null || roomNumbers.Count == 0)
            throw new ExceptionWithCode(ErrorCode.BadRequest,"atleast one room must be selected");

        var hotel = await _hotelsCollection.Find(h => h.Id == hotelId).FirstOrDefaultAsync() ??
        throw new ExceptionWithCode(ErrorCode.NotFound,$"hotel:{hotelId} does not exist");

        if(hotel.Rooms == null)
            throw new ExceptionWithCode(ErrorCode.BadRequest,"Hotel does not contain any rooms");
        
        var rooms = hotel.Rooms.Where(r => roomNumbers.Contains(r.RoomNumber)).ToList();
        if(rooms.Count != roomNumbers.Count)
            throw new ExceptionWithCode(ErrorCode.BadRequest,"Invalid room numbers");
        
        var reservationExists = await _reservationsCollection.Find(r => 
        r.Rooms.Any(room => roomNumbers.Contains(room.RoomNumber)) && 
        r.CheckInDate < checkOutDate && 
        r.CheckOutDate > checkInDate    
        ).ToListAsync();

        if(reservationExists.Count != 0)
            throw new ExceptionWithCode(ErrorCode.Conflict,"Reservation already exists");
        
        int days = (checkOutDate.Date - checkInDate.Date).Days;
        double totalPrice = rooms.Sum(r => r.PriceForNight*days);

        var newReservation = new Reservation
        {
            Rooms = rooms,
            TotalPrice = totalPrice,
            CheckInDate = checkInDate,
            CheckOutDate = checkOutDate
        };

        await _reservationsCollection.InsertOneAsync(newReservation);

        user.Reservations ??= [];
        user.Reservations.Add(newReservation);
        await _usersCollection.ReplaceOneAsync(u => u.Id == userId , user);

    }

    public async Task<List<Reservation>> GetUserReservations(string userId)
    {
        var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync() ??
        throw new ExceptionWithCode(ErrorCode.NotFound,$"user:{userId} was not found");

        if(user.Reservations == null)
            return [];
        
        return user.Reservations;
    }

    public async Task<List<Reservation>> GetUserCurrentReservations(string userId)
    {
        var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync() ??
        throw new ExceptionWithCode(ErrorCode.NotFound,$"user:{userId} was not found");

        if(user.Reservations == null)
            return [];
        
        return user.Reservations.Where(ur => DateTime.Now < ur.CheckOutDate).ToList();
        
    }

    public async Task<List<Reservation>> GetAllReservations()
    {
        return await _reservationsCollection.Find(r => true).ToListAsync();
    }

    public async Task<double> GetTotalPrice(string hotelId, DateTime checkInDate, DateTime checkOutDate, List<int> roomNumbers)
    {
        if(checkInDate.Date >= checkOutDate.Date)
            throw new ExceptionWithCode(ErrorCode.BadRequest,$"checkoutDate must be after checkInDate and minimum diference must be atleast one day");

        if(roomNumbers == null || roomNumbers.Count == 0)
            throw new ExceptionWithCode(ErrorCode.BadRequest,"atleast one room must be selected");

        var hotel = await _hotelsCollection.Find(h => h.Id == hotelId).FirstOrDefaultAsync() ??
        throw new ExceptionWithCode(ErrorCode.NotFound,$"hotel:{hotelId} does not exist");

        if(hotel.Rooms == null)
            throw new ExceptionWithCode(ErrorCode.BadRequest,"Hotel does not contain any rooms");

        var rooms = hotel.Rooms.Where(r => roomNumbers.Contains(r.RoomNumber)).ToList();
        if(rooms.Count != roomNumbers.Count)
            throw new ExceptionWithCode(ErrorCode.BadRequest,"Invalid room numbers");

        int days = (checkOutDate.Date - checkInDate.Date).Days;
        double totalPrice = rooms.Sum(r => r.PriceForNight*days);
        
        return totalPrice;
    }

  public async Task ValidateReservation(string userId , string hotelId , List<int> roomNumbers , DateTime checkInDate , DateTime checkOutDate , double ammount)
{
    if (string.IsNullOrEmpty(userId))
        throw new ExceptionWithCode(ErrorCode.BadRequest, "User ID cannot be empty");
    
    if (string.IsNullOrEmpty(hotelId))
        throw new ExceptionWithCode(ErrorCode.BadRequest, "Hotel ID cannot be empty");
    
    if (roomNumbers == null || roomNumbers.Count == 0)
        throw new ExceptionWithCode(ErrorCode.BadRequest, "At least one room must be selected");
    
    if (checkInDate.Date >= checkOutDate.Date)
        throw new ExceptionWithCode(ErrorCode.BadRequest, "Check-out date must be after check-in date, with a minimum difference of one day");
    
    var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync() ??
        throw new ExceptionWithCode(ErrorCode.NotFound, $"User {userId} does not exist");
    
    var hotel = await _hotelsCollection.Find(h => h.Id == hotelId).FirstOrDefaultAsync() ??
        throw new ExceptionWithCode(ErrorCode.NotFound, $"Hotel {hotelId} does not exist");
    
    if (hotel.Rooms == null || hotel.Rooms.Count == 0)
        throw new ExceptionWithCode(ErrorCode.BadRequest, "Hotel does not contain any rooms");
    
    var rooms = hotel.Rooms.Where(r => roomNumbers.Contains(r.RoomNumber)).ToList();
    if (rooms.Count != roomNumbers.Count)
        throw new ExceptionWithCode(ErrorCode.BadRequest, "Invalid room numbers");
    
    var reservationExists = await _reservationsCollection.Find(r => 
        r.Rooms.Any(room => roomNumbers.Contains(room.RoomNumber)) && 
        r.CheckInDate < checkOutDate && 
        r.CheckOutDate > checkInDate).ToListAsync();
    
    if (reservationExists.Count > 0)
        throw new ExceptionWithCode(ErrorCode.Conflict, "Reservation already exists for one or more selected rooms");
    
    int days = (checkOutDate.Date - checkInDate.Date).Days;
    double totalPrice = rooms.Sum(r => r.PriceForNight * days);
    
    if (ammount < totalPrice)
        throw new ExceptionWithCode(ErrorCode.BadRequest, "Insufficient amount for the reservation");
    
   
}
}