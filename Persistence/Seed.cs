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
            if (!context.Users.Any())
            {
                var Users = new List<User>{
                    new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},
                    new User {Email="ruslav2@ruslav2.pl",FirstName="Tom",LastName="Musk", UserName="ruslavruslav15"}
                };

                context.AddRange(Users);
                context.SaveChanges();
            }


            if (!context.Activities.Any())
            {
                var Users = new List<Activity>{
                    new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="aaa",Photo=new Photo{Id ="h0d8jviej44ym5sfuucg",Url="https://res.cloudinary.com/dqcup3ujq/image/upload/v1617127216/h0d8jviej44ym5sfuucg.jpg"},CreatedAt=DateTime.Now.AddDays(-80)},
                    new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="bbb",Photo=null,CreatedAt=DateTime.Now.AddDays(-40)},
                    new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="ccc",Photo=null,CreatedAt=DateTime.Now.AddDays(-20)},
                    new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="ddd",Photo=null,CreatedAt=DateTime.Now},
                    new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="ccc",Photo=null,CreatedAt=DateTime.Now.AddDays(-30)},
                    new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="ccc",Photo=null,CreatedAt=DateTime.Now.AddDays(-2)},
                    new Activity{Id = Guid.NewGuid(), User=new User {Email="ruslav1@ruslav1.pl",FirstName="Bob",LastName="smith", UserName="ruslavruslav1"},Content="ccc",Photo=null,CreatedAt=DateTime.Now.AddDays(-150)},
                };
                for (int i = 0; i < 2; i++)
                {
                    var activity = new Activity { Id = Guid.NewGuid(), User = new User { Email = "ruslav1@ruslav1.pl", FirstName = "Bob", LastName = "smith", UserName = "ruslavruslav1" }, Content = "ddd", Photo = null, CreatedAt = DateTime.Now };
                    var comments = new List<Comment>();
                    for (int j = 0; j < 100000; j++)
                    {
                        var comment = new Comment { Id = Guid.NewGuid(), Content = "lorem ipsu lorem ipsu lorem ipsu", Author = new User { Email = "ruslav1@ruslav1.pl", FirstName = "Bob", LastName = "smith", UserName = "ruslavruslav1" }, CreatedAt = DateTime.Now };
                        activity.CommentsCount += 1;
                        var replies = new List<Reply>();
                        comments.Add(comment);
                        for (int k = 0; k < 1; k++)
                        {
                            var reply = new Reply { Id = Guid.NewGuid(), Content = "lorem ipsu lorem ipsu lorem ipsu", Author = new User { Email = "ruslav1@ruslav1.pl", FirstName = "Bob", LastName = "smith", UserName = "ruslavruslav1" }, CreatedAt = DateTime.Now };
                            replies.Add(reply);
                            comment.RepliesCount += 1;
                        }
                        comment.Replies = replies;
                    }
                    activity.Comments = comments;
                    Users.Add(activity);
                }


                context.AddRange(Users);
                context.SaveChanges();
            }
        }
    }
}