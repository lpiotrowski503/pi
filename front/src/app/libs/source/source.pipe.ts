import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "source"
})
export class SourcePipe implements PipeTransform {
  transform(value: string[], ...args: any[]): any {
    console.log("value", value);
    if (value) {
      return value.join(";\n");
    }
    return value;
  }
}
