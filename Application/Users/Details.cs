using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Users
{
    public class Details
    {
        public class Query : IRequest<User>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly DataBaseContext _context;
            public Handler(DataBaseContext context)
            {
                _context = context;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
               return await _context.Users.FindAsync("4e1c3178-dd0d-4188-99e9-a295d386cc99");
            }
        }
    }
}