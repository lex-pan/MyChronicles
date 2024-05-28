namespace MyChroniclesApi.ServiceErrors;
public class Error
{
    public string Code { get; }
    public string Description { get; }

    private Error(string code, string description)
    {
        Code = code;
        Description = description;
    }

    public static Error InvalidInput(string code, string description)
    {
        return new Error(code, description);
    }

    public static Error NotFound(string code, string description)
    {
        return new Error(code, description);
    }

    public static Error InternalServerError(string code, string description)
    {
        return new Error(code, description);
    }
}