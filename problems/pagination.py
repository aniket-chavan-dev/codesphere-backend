from rest_framework.pagination import PageNumberPagination


class ProblemSetPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = "size"       
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        return super().paginate_queryset(queryset, request, view)