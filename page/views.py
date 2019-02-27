from django.shortcuts import render, redirect
from page.models import Page
from django.http import HttpResponse
from django.core.cache import cache
# import pdb;

# Create your views here.


def show_page(request, url):
    # pdb.set_trace()
    page = cache.get('page-' + url)
    print(page)
    if page is None:
        try:
            page = Page.objects.get(url=url)
            cache.set('page-' + url, page)
        except Page.DoesNotExist:
            return redirect('/page/404')
        
    if request.is_ajax():
        return HttpResponse(page.content)

    context = {'page': page}
    return render(request, 'default.html', context)
