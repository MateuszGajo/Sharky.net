using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataBaseContext context, UserManager<User> userManager)
        {
            if (!context.Users.Any() && !userManager.Users.Any())
            {
                var users = new List<User>{
                    new User {Id = "adebacba-4986-44c4-b4eb-0c66afda9d7b",Email="example@example.com",FirstName="Bob",LastName="Smith", UserName="bobsmith1", FullName="bobsmith"},
                    new User {Id ="80f1dab6-7aa0-4693-98c3-232e6aec16bb",Email="example1@example1.com",FirstName="Tom",LastName="Musk", UserName="tommusk1", FullName="tommusk"},
                    new User {Id ="06228c34-9c71-4c68-9493-ab13e0a30bd4",Email="example2@example2.com",FirstName="John",LastName="John", UserName="johnjohn1", FullName="johnjohn"},
                    new User {Id ="32257ce4-7c32-48a9-ab16-9e4be1633cdb",Email="example3@example3.com",FirstName="Harry",LastName="Brown", UserName="harrybrown1",FullName="harrybrown"},
                    new User {Id ="a997f083-7dab-45de-b45d-224520a2a29f",Email="example4@example4.com",FirstName="Charlie",LastName="William", UserName="charliewilliam1",FullName="charliewilliam"},
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }

            if (!context.UserFriendships.Any())
            {

                List<UserFriendship> friends = new List<UserFriendship>();
                var bob = await context.Users.FindAsync("adebacba-4986-44c4-b4eb-0c66afda9d7b");
                var tom = await context.Users.FindAsync("80f1dab6-7aa0-4693-98c3-232e6aec16bb");
                var john = await context.Users.FindAsync("06228c34-9c71-4c68-9493-ab13e0a30bd4");
                var harry = await context.Users.FindAsync("32257ce4-7c32-48a9-ab16-9e4be1633cdb");
                var charlie = await context.Users.FindAsync("a997f083-7dab-45de-b45d-224520a2a29f");

                for (int i = 0; i < 10; i++)
                {
                    User newUser = new User { Email = $"test{i}@test{i}.com", FirstName = $"test{i}", LastName = $"test{i}", UserName = $"test{i}test{i}${i}", FullName = $"test{i}test{i}" };
                    Conversation testConversation = new Conversation
                    {
                        Creator = bob,
                        Recipient = newUser
                    };

                    UserFriendship testFriendship = new UserFriendship
                    {
                        Id = Guid.NewGuid(),
                        RequestedBy = bob,
                        RequestedTo = newUser,
                        RequestTime = DateTime.Now,
                        FriendRequestFlag = FriendRequestFlag.Approved,
                        Conversation = testConversation
                    };
                    newUser.FriendsOf.Add(testFriendship);
                    bob.Friends.Add(testFriendship);

                    friends.Add(testFriendship);

                }

                Conversation conversationBobTom = new Conversation
                {
                    Creator = bob,
                    Recipient = tom,
                };

                UserFriendship friendshipBobTom = new UserFriendship
                {
                    Id = Guid.NewGuid(),
                    RequestedBy = bob,
                    RequestedTo = tom,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved,
                    Conversation = conversationBobTom
                };

                bob.Friends.Add(friendshipBobTom);
                tom.FriendsOf.Add(friendshipBobTom);
                friends.Add(friendshipBobTom);


                Conversation conversationJohnBob = new Conversation
                {
                    Creator = john,
                    Recipient = bob,
                };

                UserFriendship friendshipBobJohn = new UserFriendship
                {
                    Id = Guid.NewGuid(),
                    RequestedBy = john,
                    RequestedTo = bob,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved,
                    Conversation = conversationJohnBob

                };

                john.Friends.Add(friendshipBobJohn);
                bob.FriendsOf.Add(friendshipBobJohn);
                friends.Add(friendshipBobJohn);

                Conversation conversationHarryJohn = new Conversation
                {
                    Creator = harry,
                    Recipient = john,
                };

                UserFriendship friendshipJohnHarry = new UserFriendship
                {
                    Id = Guid.NewGuid(),
                    RequestedBy = harry,
                    RequestedTo = john,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved,
                    Conversation = conversationHarryJohn
                };
                harry.Friends.Add(friendshipJohnHarry);
                john.FriendsOf.Add(friendshipJohnHarry);
                friends.Add(friendshipJohnHarry);

                Conversation conversationTomHarry = new Conversation
                {
                    Creator = harry,
                    Recipient = john,
                };

                UserFriendship friendshipTomHarry = new UserFriendship
                {
                    Id = Guid.NewGuid(),
                    RequestedBy = tom,
                    RequestedTo = harry,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved,
                    Conversation = conversationTomHarry
                };

                tom.Friends.Add(friendshipTomHarry);
                harry.FriendsOf.Add(friendshipTomHarry);
                friends.Add(friendshipTomHarry);

                Conversation conversationTomJohn = new Conversation
                {
                    Creator = tom,
                    Recipient = john,
                };


                UserFriendship friendshipTomJohn = new UserFriendship
                {
                    Id = Guid.NewGuid(),
                    RequestedBy = tom,
                    RequestedTo = john,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved,
                    Conversation = conversationTomJohn
                };
                tom.Friends.Add(friendshipTomJohn);
                john.FriendsOf.Add(friendshipTomJohn);
                friends.Add(friendshipTomJohn);

                Conversation conversationTomCharlie = new Conversation
                {
                    Creator = tom,
                    Recipient = charlie,
                };


                UserFriendship friendshipTomCharlie = new UserFriendship
                {
                    Id = Guid.NewGuid(),
                    RequestedBy = tom,
                    RequestedTo = charlie,
                    RequestTime = DateTime.Now,
                    FriendRequestFlag = FriendRequestFlag.Approved,
                    Conversation = conversationTomCharlie
                };
                tom.Friends.Add(friendshipTomCharlie);
                charlie.FriendsOf.Add(friendshipTomCharlie);
                friends.Add(friendshipTomCharlie);
                System.Console.WriteLine("zapis");
                context.AddRange(friends);
                System.Console.WriteLine("zapis1");
                await context.SaveChangesAsync();
                System.Console.WriteLine("zapi2");
            }

        }
    }
}