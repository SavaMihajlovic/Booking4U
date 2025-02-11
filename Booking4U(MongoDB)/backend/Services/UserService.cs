public class UserService {
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMongoCollection<Hotel> _hotelsCollection;
    private readonly IConfiguration _configuration;
    public UserService(IConfiguration configuration , IMongoDatabase database) 
    {
        _configuration = configuration;
        _usersCollection = database.GetCollection<User>("users_collection");
        _hotelsCollection = database.GetCollection<Hotel>("hotels_collection");
    }

    public async Task Register(User user)
    {
        if(string.IsNullOrEmpty(user.FirstName) || user.FirstName.Length>30)
            throw new Exception("This field is required and it must be less than 30 characters");
        if(string.IsNullOrEmpty(user.LastName) || user.LastName.Length>30)
            throw new Exception("This field is required and it must be less than 30 characters");
        if(string.IsNullOrEmpty(user.Email) || !user.Email.EndsWith("@gmail.com") || user.Email.Length>80)
            throw new Exception("This field is required and it must end with @gmail.com and it must have maximum od 30 characters");
        if(string.IsNullOrEmpty(user.Password) || user.Password.Length < 10 || user.Password.Length > 30)
            throw new Exception("This field is required and its length must be between 10 and 30 characteds");
        if(string.IsNullOrEmpty(user.TypeOfUser) || (user.TypeOfUser!="user" && user.TypeOfUser!="admin") || user.TypeOfUser.Length>10)
            throw new Exception("This field is required and it must be user or admin");

        string hashpass = BCrypt.Net.BCrypt.HashPassword(user.Password);

        user.Password = hashpass;

        await _usersCollection.InsertOneAsync(user);
    }

    public async Task<string> Login(string email, string password)
    {
        if(string.IsNullOrEmpty(email) || !email.EndsWith("@gmail.com"))
            throw new Exception("Field is required and it must end with @gmail.com");
        if(string.IsNullOrEmpty(password))
            throw new Exception("This field is required");
        
        var user = await _usersCollection.Find(u => u.Email == email).FirstOrDefaultAsync();

        if(user == null)
            throw new Exception("User does not exist");
        
        if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
            throw new Exception("Invalid password");

        string token = CreateToken(user);

        return token;
    }
    private string CreateToken(User user){
        List<Claim> claims = new List<Claim>(){
            new Claim("Email", user.Email),
            new Claim("FirstName", user.FirstName ),
            new Claim("LastName", user.LastName),
            new Claim("TypeOfUser" , user.TypeOfUser)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value!));
        var cred = new SigningCredentials(key , SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            claims: claims,
            expires : DateTime.Now.AddHours(12),
            signingCredentials : cred
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return jwt;
    } 

    public async Task AddReservations(string userId , string hotelId , List<int> roomNumbers)
    {
        var user = await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync() ??
        throw new Exception($"user:{userId} does not exist");
        var hotel = await _hotelsCollection.Find(h => h.Id == hotelId).FirstOrDefaultAsync() ??
        throw new Exception($"hotel:{hotelId} does not exist");
        if(hotel.Rooms == null)
            throw new Exception("Hotel does not contain any rooms");
        var rooms = hotel.Rooms.Where(r => roomNumbers.Contains(r.RoomNumber)).ToList();
        if(rooms.Count != roomNumbers.Count)
            throw new Exception("Invalid room numbers");
        double totalPrice = rooms.Sum(r => r.PriceForNight);
        user.Reservations ??= [];
        user.Reservations.Add(new Reservation { Rooms = rooms, TotalPrice = totalPrice });
        await _usersCollection.ReplaceOneAsync(u => u.Id == userId , user);
    }
}