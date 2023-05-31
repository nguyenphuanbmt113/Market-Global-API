import { Body, Controller, Post } from '@nestjs/common';
import { INameSearch, ISearch } from './dto/search.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Post()
  search(@Body() searchPayload: ISearch) {
    const { name, limit, page, take, type } = searchPayload;
    return this.searchService.search(name, type, take, page, limit);
  }

  @Post('items-names')
  getItemsNames(@Body() searchPayload: INameSearch) {
    const { name, type } = searchPayload;
    return this.searchService.getNames(name, type);
  }
}
