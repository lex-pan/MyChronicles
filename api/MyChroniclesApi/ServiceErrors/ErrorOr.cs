namespace MyChroniclesApi.ServiceErrors;
public class ErrorOr<T> {
    public T? value { get; }
    public Error? error { get; }

    protected ErrorOr(T Value) {
        value = Value;
        error = null;
    }

    protected ErrorOr(Error error_msg) {
        value = default(T);
        error = error_msg;
    }

    public static ErrorOr<T> Success(T value)
    {
        return new ErrorOr<T>(value);
    }

    public static ErrorOr<T> Failure(Error error)
    {
        return new ErrorOr<T>(error);
    }
}