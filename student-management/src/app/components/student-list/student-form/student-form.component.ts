/**
 * @author Sourabh Kanwade
 * @email sourabhkanwade10@gmail.com
 * @create date 2021-09-07
 * @modify date 2021-09-07
 * @desc Form component for add and editing student also adds validation to form
 */
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StudentDataService } from "../../../services/student-data.service";

@Component({
  selector: "app-student-form",
  templateUrl: "./student-form.component.html",
  styleUrls: ["./student-form.component.scss"],
})
export class StudentFormComponent implements OnInit {
  @Input() formName: string = "";
  @Input() studentId: string;
  @Input() btnText: string;
  @Output() onStudentFormSubmit = new EventEmitter();
  student: any;
  studentForm: FormGroup;
  imgUrl: string = "assets/img/user_icon.svg";
  imgFileName: string = "Choose an image";
  constructor(
    private fb: FormBuilder,
    private studentService: StudentDataService
  ) {}
  ngOnInit(): void {
    if (this.studentId != undefined) {
      this.studentService
        .getStudentById(this.studentId)
        .subscribe((resp: any) => {
          let data = resp.body;
          this.student = data;
          this.imgUrl = this.student.picture;
          this.studentForm = this.fb.group(data);
          this.addValidators();
        });
    } else {
      this.studentForm = this.fb.group({
        last_name: [""],
        first_name: [""],
        email: [""],
        grade: [""],
        gender: ["F"],
        DOB: [""],
        phone: [""],
        address: [""],
        picture: [""],
      });
      this.addValidators();
    }
  }
  addValidators() {
    // Validators
    this.studentForm.controls.picture.setValidators([Validators.required]);
    this.studentForm.controls.first_name.setValidators([
      Validators.required,
      Validators.pattern("^[a-zA-Z]*$"),
    ]);
    this.studentForm.controls.last_name.setValidators([
      Validators.required,
      Validators.pattern("^[a-zA-Z]*$"),
    ]);
    this.studentForm.controls.grade.setValidators([
      Validators.required,
      Validators.pattern("[ABCDE]"),
    ]);
    this.studentForm.controls.DOB.setValidators([Validators.required]);
    this.studentForm.controls.email.setValidators([
      Validators.required,
      Validators.email,
    ]);
    this.studentForm.controls.phone.setValidators([
      Validators.required,
      Validators.minLength(12),
      Validators.maxLength(12),
      Validators.pattern("[0-9]{3}-[0-9]{3}-[0-9]{4}"),
    ]);
    this.studentForm.controls.address.setValidators([
      Validators.required,
      Validators.minLength(10),
    ]);
  }
  showPreview(event) {
    if (event.target.files.length != 0) {
      const file = (event.target as HTMLInputElement).files[0];
      this.studentForm.controls["picture"].setValue(file ? file.name : ""); // <-- Set Value for Validation
      this.imgFileName = file.name;
      this.studentForm.patchValue({
        picture: file,
      });
      this.studentForm.get("picture").updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imgUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  formSubmitHandler() {
    this.onStudentFormSubmit.emit(this.studentForm.value);
  }
}
