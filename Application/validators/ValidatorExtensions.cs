using System.Text.RegularExpressions;
using FluentValidation;

namespace Application.validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T,string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
            .NotEmpty()
            .MinimumLength(6).WithMessage("password must be at least 6 characters")
            .Matches("[A-Z]").WithMessage("Password must cotains 1 uppercase letter")
            .Matches("[a-z]").WithMessage("Password must have at least 1 lowercase character")
            .Matches("[0-9]").WithMessage("Password must contain a number")
            .Matches("[^-a-zA-Z0-9]").WithMessage("Password must contain non alphanumeric");

            return options;
        }

           public static IRuleBuilder<T,string> Phone<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            string pattern = @"^\d{9,10}$";
   
            var options = ruleBuilder
            .Custom((phone,context)=>{
                         System.Console.WriteLine(Regex.IsMatch(phone, pattern));
                if(phone.Length >0 && !Regex.IsMatch(phone, pattern)){
                    context.AddFailure("invalid phone number");
                }
            });

            return options;
        }
    }
}