import {Pipe,PipeTransform,Injectable} from "@angular/core"
import * as numeral from 'numeral';

@Pipe({
name:'numeralPipe'
})
@Injectable()
export class NumeralPipe implements PipeTransform{
    transform(count:any, format:string):any{
       var numericalFormat = numeral(count).format(format);
       return numericalFormat;
     };
}
