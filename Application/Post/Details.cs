using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Post
{
    public class Details
    {
        public class Query : IRequest<Domain.Post>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Domain.Post>
        {
            private readonly DataBaseContext _context;
            public Handler(DataBaseContext context)
            {
                _context = context;
            }

            public async Task<Domain.Post> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Posts.Include(p=> p.Photo).FirstOrDefaultAsync(x=> x.Id == request.Id);
            }
        }
    }
}