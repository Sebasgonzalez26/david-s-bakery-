using System.ComponentModel.DataAnnotations;

namespace Abstracciones.Modelos
{
    public class Token
    {
        public bool   ValidacionExitosa { get; set; }
        public string AccessToken       { get; set; } = string.Empty;
    }

    public class TokenConfiguracion
    {
        [Required][StringLength(100, MinimumLength = 32)]
        public string Key      { get; set; } = string.Empty;
        [Required] public string Issuer   { get; set; } = string.Empty;
        [Required] public string Audience { get; set; } = string.Empty;
        public double Expires { get; set; } = 60;
    }
}
