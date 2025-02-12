public class ExceptionWithCode : Exception
{
    public ErrorCode ErrorCode { get; set; }
    public ExceptionWithCode(ErrorCode errorCode, string message)
        : base(message)
    {
        ErrorCode = errorCode;
    }
    public ExceptionWithCode(ErrorCode errorCode, string message, Exception innerException)
        : base(message, innerException)
    {
        ErrorCode = errorCode;
    }
}