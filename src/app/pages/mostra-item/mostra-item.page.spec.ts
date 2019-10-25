import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostraItemPage } from './mostra-item.page';

describe('MostraItemPage', () => {
  let component: MostraItemPage;
  let fixture: ComponentFixture<MostraItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostraItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostraItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
