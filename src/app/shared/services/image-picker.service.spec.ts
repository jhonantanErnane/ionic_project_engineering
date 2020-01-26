import { TestBed } from '@angular/core/testing';
import { ImagePickerService } from './image-picker.service';
import { Camera } from '@ionic-native/camera/ngx';

describe('ImagePickerService', () => {
  let cameraSpy, getPictureSpy;

  getPictureSpy = Promise.resolve();

  cameraSpy = jasmine.createSpyObj('Camera', { getPicture: getPictureSpy });
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: Camera, useValue: cameraSpy }
    ],
  }));

  it('should be created', () => {
    const service: ImagePickerService = TestBed.get(ImagePickerService);
    expect(service).toBeTruthy();
  });
});
