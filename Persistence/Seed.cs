using System;
using System.Collections.Generic;
using System.Linq;
using Domain;

namespace Persistence
{
    public class Seed
    {
          public static void SeedData(DataBaseContext context)
        {
            if(!context.Users.Any()){
                var Users  = new List<User>{
                    new User {Email="ruslav1@ruslav1.pl",Firstname="Bob",Lastname="smith", UserName="ruslavruslav1", Posts = new List<Post>{new Post{Content="haha",Photo=new Photo{Id="1",Url=""},CreateAt= DateTime.Now}}},
                    new User {Email="ruslav2@ruslav2.pl",Firstname="Tom",Lastname="Musk", UserName="ruslavruslav15", Posts = new List<Post>{new Post{Content="haha",Photo=new Photo{Id="2",Url=""},CreateAt= DateTime.Now}}}
                };

                context.AddRange(Users);
                context.SaveChanges();
            }

            if(!context.Posts.Any()){
                var Posts  = new List<Post>{
                    new Post{Content= "aaa",Photo = new Photo{Id="2",Url=""},CreateAt = DateTime.Now}
                };

                context.AddRange(Posts);
                context.SaveChanges();
            }
        }
    }
}