using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Domain.Activity>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Domain.Activity>
        {
            private readonly DataBaseContext _context;
            public Handler(DataBaseContext context)
            {
                _context = context;
            }

            public async Task<Domain.Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                var post = await _context.Activities.Include(p=> p.Photo).FirstOrDefaultAsync(x=> x.Id == request.Id);

                if(post == null) throw new RestException(HttpStatusCode.NotFound, new {Error = "Post doesn't exist"});

                return post;
            }
        }
    }
}