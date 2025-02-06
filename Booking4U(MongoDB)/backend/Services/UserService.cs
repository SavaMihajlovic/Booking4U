public class UserService {
    private readonly IMongoCollection<User> _userCollection;
    private readonly IConfiguration _configuration;
    public UserService(IConfiguration configuration , IMongoDatabase database) 
    {
        _configuration = configuration;
        _userCollection = database.GetCollection<User>("users_collection");
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

        await _userCollection.InsertOneAsync(user);
    }

    public async Task<string> Login(string email, string password)
    {
        if(string.IsNullOrEmpty(email) || !email.EndsWith("@gmail.com"))
            throw new Exception("Field is required and it must end with @gmail.com");
        if(string.IsNullOrEmpty(password))
            throw new Exception("This field is required");
        
        var user = await _userCollection.Find(u => u.Email == email).FirstOrDefaultAsync();

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
}