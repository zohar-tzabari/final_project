from pathlib import Path
import PIL.Image
import torch
from PIL import ImageDraw


class YoloModel:
    def __init__(self):
        self.repo = r'ultralytics/yolov5'
        self._model = None

    @property
    def model(self):
        return self._model

    @model.setter
    def model(self, value):
        self._model = value

    def analyze_photo(self, image_data, item=None) -> list:
        raise NotImplemented


class ImportedModel(YoloModel):
    def __init__(self, model_url: str):
        super().__init__()
        self._model_url = model_url

    def load_coco_model(self) -> None:
        self.model = torch.hub.load(self.repo, self._model_url, pretrained=True)

    def detect_object_in_photo(self):
        pass

    def analyze_photo(self, image_data, item=None) -> list:
        results = self.model([image_data])
        boxes = results.xyxy[0]
        filtered_boxes = list(filter(lambda box: results.names[int(box[5])] == item, boxes))
        return filtered_boxes


class LocalModel(YoloModel):
    def __init__(self, model_path: Path):
        super().__init__()
        self._model_path = model_path

    def load_my_model(self) -> None:
        self.model = torch.hub.load(self.repo, 'custom', path=self._model_path)

    def analyze_photo(self, image_data, item=None) -> list:
        results = self.model([image_data])
        boxes = results.xyxy[0]
        filtered_boxes = list(filter(lambda box: box[4] > 0.8, boxes))
        return filtered_boxes


if __name__ == '__main__':
    # ym = ImportedModel('yolov5s')
    # ym.load_coco_model()
    p = Path('keys_model/best.pt')
    lm = LocalModel(p)
    lm.load_my_model()
    print(lm.model)
